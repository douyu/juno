package testworker

import (
	"go/build"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"

	"github.com/douyu/jupiter/pkg/xlog"
	"golang.org/x/lint"
)

type (
	Linter struct {
		dir      string
		problems []lint.Problem
	}
)

var (
	buildContext = build.Default
	goroot       = filepath.Clean(runtime.GOROOT())
	gorootSrc    = filepath.Join(goroot, "src")
)

func NewLinter(dir string) *Linter {
	return &Linter{
		dir:      dir,
		problems: make([]lint.Problem, 0),
	}
}

func (l *Linter) Lint() (problems []lint.Problem, err error) {
	dirs := make([]string, 0)
	for _, dirname := range l.allPackagesInFS(l.dir) {
		dirs = append(dirs, dirname)
	}

	l.problems = make([]lint.Problem, 0)
	for _, dir := range dirs {
		err = l.lintDir(dir)
		if err != nil {
			return l.problems, err
		}
	}

	problems = l.problems
	return
}

func (l *Linter) Problems() []lint.Problem {
	return l.problems
}

func (l *Linter) lintFiles(filenames ...string) (err error) {
	files := make(map[string][]byte)
	for _, filename := range filenames {
		src, err := ioutil.ReadFile(filename)
		if err != nil {
			xlog.Warn("Linter.lintFiles", xlog.String("err", err.Error()))
			continue
		}
		files[filename] = src
	}

	linter := new(lint.Linter)
	ps, err := linter.LintFiles(files)
	if err != nil {
		return
	}
	for _, p := range ps {
		if p.Confidence >= 0.8 {
			//fmt.Printf("%v: %s\n", p.Position, p.Text)
			l.problems = append(l.problems, p)
		}
	}

	return
}

func (l *Linter) lintDir(dirname string) error {
	pkg, err := build.ImportDir(dirname, 0)
	if err != nil {
		return err
	}
	return l.lintImportedPackage(pkg)
}

func (l *Linter) lintPackage(pkgname string) error {
	pkg, err := build.Import(pkgname, ".", 0)
	if err != nil {
		return err
	}

	return l.lintImportedPackage(pkg)
}

func (l *Linter) lintImportedPackage(pkg *build.Package) (err error) {
	var files []string
	files = append(files, pkg.GoFiles...)
	files = append(files, pkg.CgoFiles...)
	files = append(files, pkg.TestGoFiles...)
	if pkg.Dir != "." {
		for i, f := range files {
			files[i] = filepath.Join(pkg.Dir, f)
		}
	}

	var _files []string
	for _, f := range files {
		// skip node_modules
		if strings.Contains(f, "/node_modules/") {
			continue
		}

		// skip vendor
		if strings.Contains(f, "/vendor/") {
			continue
		}

		_files = append(_files, f)
	}

	return l.lintFiles(_files...)
}

func (l *Linter) importPathsNoDotExpansion(args []string) []string {
	if len(args) == 0 {
		return []string{"."}
	}
	var out []string
	for _, a := range args {

		if filepath.Separator == '\\' {
			a = strings.Replace(a, `\`, `/`, -1)
		}

		if strings.HasPrefix(a, "./") {
			a = "./" + path.Clean(a)
			if a == "./." {
				a = "."
			}
		} else {
			a = path.Clean(a)
		}
		if a == "all" || a == "std" {
			out = append(out, l.allPackages(a)...)
			continue
		}
		out = append(out, a)
	}
	return out
}

func (l *Linter) importPaths(args []string) []string {
	args = l.importPathsNoDotExpansion(args)
	var out []string
	for _, a := range args {
		if strings.Contains(a, "...") {
			if build.IsLocalImport(a) {
				out = append(out, l.allPackagesInFS(a)...)
			} else {
				out = append(out, l.allPackages(a)...)
			}
			continue
		}
		out = append(out, a)
	}
	return out
}

func (l *Linter) matchPattern(pattern string) func(name string) bool {
	re := regexp.QuoteMeta(pattern)
	re = strings.Replace(re, `\.\.\.`, `.*`, -1)

	if strings.HasSuffix(re, `/.*`) {
		re = re[:len(re)-len(`/.*`)] + `(/.*)?`
	}
	reg := regexp.MustCompile(`^` + re + `$`)
	return func(name string) bool {
		return reg.MatchString(name)
	}
}

func (l *Linter) treeCanMatchPattern(pattern string) func(name string) bool {
	wildCard := false
	if i := strings.Index(pattern, "..."); i >= 0 {
		wildCard = true
		pattern = pattern[:i]
	}
	return func(name string) bool {
		return len(name) <= len(pattern) && hasPathPrefix(pattern, name) ||
			wildCard && strings.HasPrefix(name, pattern)
	}
}

func (l *Linter) allPackages(pattern string) []string {
	pkgs := l.matchPackages(pattern)
	if len(pkgs) == 0 {
		xlog.Warnf("Linter.lintImportedPackage. warning: %q matched no packages\n", pattern)
	}
	return pkgs
}

func (l *Linter) matchPackages(pattern string) []string {
	match := func(string) bool { return true }
	treeCanMatch := func(string) bool { return true }
	if pattern != "all" && pattern != "std" {
		match = l.matchPattern(pattern)
		treeCanMatch = l.treeCanMatchPattern(pattern)
	}

	have := map[string]bool{
		"builtin": true,
	}
	if !buildContext.CgoEnabled {
		have["runtime/cgo"] = true

	}
	var pkgs []string

	cmd := filepath.Join(goroot, "src/cmd") + string(filepath.Separator)
	_ = filepath.Walk(cmd, func(path string, fi os.FileInfo, err error) error {
		if err != nil || !fi.IsDir() || path == cmd {
			return nil
		}
		name := path[len(cmd):]
		if !treeCanMatch(name) {
			return filepath.SkipDir
		}

		if strings.Contains(name, string(filepath.Separator)) {
			return filepath.SkipDir
		}

		name = "cmd/" + name
		if have[name] {
			return nil
		}
		have[name] = true
		if !match(name) {
			return nil
		}
		_, err = buildContext.ImportDir(path, 0)
		if err != nil {
			if _, noGo := err.(*build.NoGoError); !noGo {
				log.Print(err)
			}
			return nil
		}
		pkgs = append(pkgs, name)
		return nil
	})

	for _, src := range buildContext.SrcDirs() {
		if (pattern == "std" || pattern == "cmd") && src != gorootSrc {
			continue
		}
		src = filepath.Clean(src) + string(filepath.Separator)
		root := src
		if pattern == "cmd" {
			root += "cmd" + string(filepath.Separator)
		}
		_ = filepath.Walk(root, func(path string, fi os.FileInfo, err error) error {
			if err != nil || !fi.IsDir() || path == src {
				return nil
			}

			_, elem := filepath.Split(path)
			if strings.HasPrefix(elem, ".") || strings.HasPrefix(elem, "_") || elem == "testdata" {
				return filepath.SkipDir
			}

			name := filepath.ToSlash(path[len(src):])
			if pattern == "std" && (strings.Contains(name, ".") || name == "cmd") {

				return filepath.SkipDir
			}
			if !treeCanMatch(name) {
				return filepath.SkipDir
			}
			if have[name] {
				return nil
			}
			have[name] = true
			if !match(name) {
				return nil
			}
			_, err = buildContext.ImportDir(path, 0)
			if err != nil {
				if _, noGo := err.(*build.NoGoError); noGo {
					return nil
				}
			}
			pkgs = append(pkgs, name)
			return nil
		})
	}
	return pkgs
}

func (l *Linter) allPackagesInFS(pattern string) []string {
	pkgs := l.matchPackagesInFS(pattern)
	if len(pkgs) == 0 {
		xlog.Warnf("warning: %q matched no packages\n", pattern)
	}
	return pkgs
}

func (l *Linter) matchPackagesInFS(pattern string) []string {

	i := strings.Index(pattern, "...")
	dir, _ := path.Split(pattern[:i])

	prefix := ""
	if strings.HasPrefix(pattern, "./") {
		prefix = "./"
	}
	match := l.matchPattern(pattern)

	var pkgs []string
	_ = filepath.Walk(dir, func(path string, fi os.FileInfo, err error) error {
		if err != nil || !fi.IsDir() {
			return nil
		}
		if path == dir {

			path = filepath.Clean(path)
		}

		_, elem := filepath.Split(path)
		dot := strings.HasPrefix(elem, ".") && elem != "." && elem != ".."
		if dot || strings.HasPrefix(elem, "_") || elem == "testdata" || elem == "node_modules" || elem == "vendor" {
			return filepath.SkipDir
		}

		name := prefix + filepath.ToSlash(path)
		if !match(name) {
			return nil
		}
		if _, err = build.ImportDir(path, 0); err != nil {
			if _, noGo := err.(*build.NoGoError); !noGo {
				log.Print(err)
			}
			return nil
		}
		pkgs = append(pkgs, name)
		return nil
	})
	return pkgs
}

func isDir(filename string) bool {
	fi, err := os.Stat(filename)
	return err == nil && fi.IsDir()
}

func exists(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil
}

func hasPathPrefix(s, prefix string) bool {
	switch {
	default:
		return false
	case len(s) == len(prefix):
		return s == prefix
	case len(s) > len(prefix):
		if prefix != "" && prefix[len(prefix)-1] == '/' {
			return strings.HasPrefix(s, prefix)
		}
		return s[len(prefix)] == '/' && s[:len(prefix)] == prefix
	}
}
