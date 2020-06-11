package gitlab

import (
	"crypto/tls"
	"errors"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/douyu/jupiter/pkg/conf"

	"github.com/douyu/juno/internal/pkg/library/util"
	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/douyu/juno/internal/pkg/packages/gitlab/client"
	"github.com/douyu/juno/internal/pkg/packages/gitlab/model"
	"github.com/douyu/juno/internal/pkg/packages/httputil"
	"github.com/douyu/juno/internal/pkg/packages/oauth2"
	"github.com/douyu/juno/internal/pkg/packages/remote"
)

// DefaultScope ...
const DefaultScope = "api"

// Opts defines configuration options.
type Opts struct {
	URL         string // Gogs server url.
	Client      string // Oauth2 client id.
	Secret      string // Oauth2 client secret.
	Username    string // Optional machine account username.
	Password    string // Optional machine account password.
	PrivateMode bool   // Gogs is running in private mode.
	SkipVerify  bool   // Skip ssl verification.
}

// New returns a Remote implementation that integrates with Gitlab, an open
// source Git service. See https://gitlab.com
func New(opts Opts) (*Gitlab, error) {
	url, err := url.Parse(opts.URL)
	if err != nil {
		return nil, err
	}
	host, _, err := net.SplitHostPort(url.Host)
	if err == nil {
		url.Host = host
	}
	return &Gitlab{
		URL:         opts.URL,
		Client:      opts.Client,
		Secret:      opts.Secret,
		Machine:     url.Host,
		Username:    opts.Username,
		Password:    opts.Password,
		PrivateMode: opts.PrivateMode,
		SkipVerify:  opts.SkipVerify,
	}, nil
}

// Gitlab ...
type Gitlab struct {
	URL          string
	Client       string
	Secret       string
	Machine      string
	Username     string
	Password     string
	PrivateMode  bool
	SkipVerify   bool
	HideArchives bool
	Search       bool
}

// Auth ...
func (g *Gitlab) Auth(token, secret string) (string, error) {
	client := NewClient(g.URL, token, g.SkipVerify)
	login, err := client.CurrentUser()
	if err != nil {
		return "", err
	}
	return login.Username, nil
}

// Teams ...
func (g *Gitlab) Teams(u *db.User) ([]*model.Team, error) {
	client := NewClient(g.URL, u.Token, g.SkipVerify)
	groups, err := client.AllGroups()
	if err != nil {
		return nil, err
	}
	var teams []*model.Team
	for _, group := range groups {
		teams = append(teams, &model.Team{
			Login: group.Name,
		})
	}
	return teams, nil
}

// UserByID 由userID获得user信息 by hexuan
func (g *Gitlab) UserByID(u *db.User, id string) (client.User, error) {
	client1 := NewClient(g.URL, u.Token, g.SkipVerify)
	out, err := client1.UserByID(id)
	if err != nil {
		return client.User{}, err
	}
	return out, err
}

// UserProjectList ...
func (g *Gitlab) UserProjectList(u *db.User) ([]*client.SingleProject, error) {
	client1 := NewClient(g.URL, u.Token, g.SkipVerify)
	out, err := client1.UserProjectList(strconv.Itoa(int(u.Uid)))
	if err != nil {
		return nil, err
	}
	return out, err
}

// AllProjectList ...
func (g *Gitlab) AllProjectList(u *db.User) ([]*client.SingleSimpleProject, error) {
	repo, err := NewClient(g.URL, u.Token, g.SkipVerify).AllProjectList(g.HideArchives)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// ProjectList ...
func (g *Gitlab) ProjectList(page int, perPage int, token string) ([]*client.SingleSimpleProject, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).ProjectList(page, perPage, g.HideArchives)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// Get single project
// https://docs.gitlab.com/ce/api/projects.html#get-single-project
func (g *Gitlab) SingleProject(token string, gid int) (*client.SingleProject, error) {

	repo, err := NewClient(g.URL, token, g.SkipVerify).SingleProject(strconv.Itoa(gid))
	if err != nil {
		return nil, err
	}
	return repo, err
}

// AddProjectHook ...
func (g *Gitlab) AddProjectHook(token string, id int, url string, pushEvents bool) (*client.AddProjectHook, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).AddProjectHook(id, url, pushEvents)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// ValidateBranch ...
func (g *Gitlab) ValidateBranch(token string, gid int, branch string) (bool, error) {
	brancheTmps, err := g.BranchList(token, gid)
	if err != nil {
		return false, err
	}
	branches := make([]string, 0)
	for _, value := range brancheTmps {
		branches = append(branches, value.Name)
	}
	if _, exist := util.InArray(branch, branches); exist {
		return true, nil
	}

	return false, nil
}

// BranchList ...
func (g *Gitlab) BranchList(token string, gid int) ([]*client.SingleBranch, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).BranchList(strconv.Itoa(gid))
	if err != nil {
		return nil, err
	}
	return repo, err
}

// SingleBranch ...
func (g *Gitlab) SingleBranch(token string, id int, branch string) (*client.SingleBranch, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).SingleBranch(strconv.Itoa(id), url.QueryEscape(branch))
	if err != nil {
		return nil, err
	}
	return repo, err
}

// SingleCommit ...
func (g *Gitlab) SingleCommit(token string, id int, sha string) (*client.SingleCommit, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).SingleCommit(strconv.Itoa(id), sha)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// CommitList ...
func (g *Gitlab) CommitList(token string, id int, ref string) ([]client.SingleCommit, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).CommitList(strconv.Itoa(id), ref)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// AddDeployKey ...
func (g *Gitlab) AddDeployKey(token string, id int, deployTitle string, deployKey string) (*client.AddDeployKey, error) {
	repo, err := NewClient(g.URL, token, g.SkipVerify).AddDeployKey(strconv.Itoa(id), deployTitle, deployKey)
	if err != nil {
		return nil, err
	}
	return repo, err
}

// ValidateTag ...
func (g *Gitlab) ValidateTag(token string, gid int, tagName string) (bool, error) {
	tags, err := g.GetTagList(token, gid)
	if err != nil {
		return false, err
	}

	for _, t := range tags {
		if t.Name == tagName {
			return true, nil
		}
	}
	return false, errors.New(tagName + " not found")
}

// GetTagList ...
func (g *Gitlab) GetTagList(token string, gid int) ([]client.SingleTag, error) {
	return NewClient(g.URL, token, g.SkipVerify).TagList(strconv.Itoa(gid))
}

// GetSingleTag ...
func (g *Gitlab) GetSingleTag(token string, gid int, tag string) (client.SingleTag, error) {
	return NewClient(g.URL, token, g.SkipVerify).SingleTag(strconv.Itoa(gid), tag)
}

// CurrentUser 获得当前登录者 byhexuan
func (g *Gitlab) CurrentUser(u *db.User) (client.User, error) {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)

	out, err := client1.CurrentUser()
	if err != nil {
		return client.User{}, err
	}
	return out, err
}

// GetMemberOfProject获得当前登录者 by hexuan
func (g *Gitlab) GetMemberOfProject(u *db.User, pid, uid string) (client.User, error) {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)
	fmt.Println("GetMemberOfProject", g.URL, u.Token, g.SkipVerify)
	out, err := client1.GetMemberOfProject(pid, uid)
	if err != nil {
		return client.User{}, err
	}
	return out, err
}

// GetUserOfProject  by hexuan
func (g *Gitlab) GetUserOfProject(u *db.User, pid, uname string) (client.User, error) {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)
	fmt.Println("GetUserOfProject", g.URL, u.Token, g.SkipVerify)
	out, err := client1.GetUserOfProject(pid, uname)
	if err != nil {
		fmt.Println("GetUserOfProject err", err)
		return client.User{}, err
	}
	return *out, err
}

// GetMemberOfProject获得当前登录者 by hexuan
func (g *Gitlab) GetProjectMembersList(u *db.User, pid string) ([]*client.User, error) {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)

	out, err := client1.GetProjectMembersList(pid)
	if err != nil {
		return nil, err
	}
	return out, err
}

// GetProjectAccessList获得当前登录者 by xiaoshen
func (g *Gitlab) GetProjectAccessList(u *db.User, pid string) (int, error) {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)
	level, err := client1.GetProjectAccessList(pid)
	if err != nil {
		return 0, err
	}
	return level, nil
}

// GetBranchAccessList获得当前登录者 by xiaoshen
func (g *Gitlab) GetBranchAccessList(u *db.User, pid string) error {
	var client1 = NewClient(g.URL, u.Token, g.SkipVerify)
	return client1.GetBranchtAccessList(pid)
}

// Files fetches a list of files information
func (g *Gitlab) FilesParse(user *model.User, id, ref, f string) ([]*client.RepoFile, error) {
	var client = NewClient(g.URL, user.Token, g.SkipVerify)

	out, err := client.RepoFilesInPath(id, ref, f, false)
	if err != nil {
		return nil, err
	}
	return out, err
}

// FileRef fetches the file from the GitHub repository and returns its contents.
func (g *Gitlab) FileRefParse(u *model.User, id, ref, f string) (*client.FileContent, error) {
	var client = NewClient(g.URL, u.Token, g.SkipVerify)

	out, err := client.RepoRawFileRefParse(id, ref, f)
	if err != nil {
		return nil, err
	}
	return out, err
}

// File fetches a file from the remote repository and returns in string format.
func (g *Gitlab) File(user *db.User, repo *model.Repo, build *model.Build, f string) ([]byte, error) {
	return g.FileRef(user, repo, build.Commit, f)
}

// FileRef fetches the file from the GitHub repository and returns its contents.
func (g *Gitlab) FileRef(u *db.User, r *model.Repo, ref, f string) ([]byte, error) {
	var client = NewClient(g.URL, u.Token, g.SkipVerify)
	id, err := GetProjectId(g, client, r.Owner, r.Name)
	if err != nil {
		return nil, err
	}

	out, err := client.RepoRawFileRef(id, ref, f)
	if err != nil {
		return nil, err
	}
	return out, err
}

// NOTE Currently gitlab doesn't support status for commits and events,
//      also if we want get MR status in gitlab we need implement a special plugin for gitlab,
//      gitlab uses API to fetch build status on client side. But for now we skip this.
func (g *Gitlab) Status(u *db.User, repo *model.Repo, b *model.Build, link string) error {
	client := NewClient(g.URL, u.Token, g.SkipVerify)

	status := getStatus(b.Status)
	desc := getDesc(b.Status)

	client.SetStatus(
		ns(repo.Owner, repo.Name),
		b.Commit,
		status,
		desc,
		strings.Replace(b.Ref, "refs/heads/", "", -1),
		link,
	)

	// Gitlab statuses it's a new feature, just ignore error
	// if gitlab version not support this
	return nil
}

// Netrc returns a netrc file capable of authenticating Gitlab requests and
// cloning Gitlab repositories. The netrc will use the global machine account
// when configured.
func (g *Gitlab) Netrc(u *db.User, r *model.Repo) (*model.Netrc, error) {
	if g.Password != "" {
		return &model.Netrc{
			Login:    g.Username,
			Password: g.Password,
			Machine:  g.Machine,
		}, nil
	}
	return &model.Netrc{
		Login:    "oauth2",
		Password: u.Token,
		Machine:  g.Machine,
	}, nil
}

// Activate activates a repository by adding a Post-commit hook and
// a Public Deploy key, if applicable.
func (g *Gitlab) Activate(user *db.User, repo *model.Repo, link string) error {
	var client = NewClient(g.URL, user.Token, g.SkipVerify)
	id, err := GetProjectId(g, client, repo.Owner, repo.Name)
	if err != nil {
		return err
	}

	uri, err := url.Parse(link)
	if err != nil {
		return err
	}

	droneUrl := fmt.Sprintf("%s://%s", uri.Scheme, uri.Host)
	droneToken := uri.Query().Get("access_token")
	ssl_verify := strconv.FormatBool(!g.SkipVerify)

	return client.AddDroneService(id, map[string]string{
		"token":                   droneToken,
		"drone_url":               droneUrl,
		"enable_ssl_verification": ssl_verify,
	})
}

// Deactivate removes a repository by removing all the post-commit hooks
// which are equal to link and removing the SSH deploy key.
func (g *Gitlab) Deactivate(user *db.User, repo *model.Repo, link string) error {
	var client = NewClient(g.URL, user.Token, g.SkipVerify)
	id, err := GetProjectId(g, client, repo.Owner, repo.Name)
	if err != nil {
		return err
	}

	return client.DeleteDroneService(id)
}

// ParseHook parses the post-commit hook from the Request body
// and returns the required data in a standard format.
func (g *Gitlab) Hook(req *http.Request) (*model.Repo, *model.Build, error) {
	defer req.Body.Close()
	var payload, _ = ioutil.ReadAll(req.Body)
	var parsed, err = client.ParseHook(payload)
	if err != nil {
		return nil, nil, err
	}

	switch parsed.ObjectKind {
	case "merge_request":
		return mergeRequest(parsed, req)
	case "tag_push", "push":
		return push(parsed, req)
	default:
		return nil, nil, nil
	}
}

func mergeRequest(parsed *client.HookPayload, req *http.Request) (*model.Repo, *model.Build, error) {

	repo := &model.Repo{}

	obj := parsed.ObjectAttributes
	if obj == nil {
		return nil, nil, fmt.Errorf("object_attributes key expected in merge request hook")
	}

	target := obj.Target
	source := obj.Source

	if target == nil && source == nil {
		return nil, nil, fmt.Errorf("target and source keys expected in merge request hook")
	} else if target == nil {
		return nil, nil, fmt.Errorf("target key expected in merge request hook")
	} else if source == nil {
		return nil, nil, fmt.Errorf("source key exptected in merge request hook")
	}

	if target.PathWithNamespace != "" {
		var err error
		if repo.Owner, repo.Name, err = ExtractFromPath(target.PathWithNamespace); err != nil {
			return nil, nil, err
		}
		repo.FullName = target.PathWithNamespace
	} else {
		repo.Owner = req.FormValue("owner")
		repo.Name = req.FormValue("name")
		repo.FullName = fmt.Sprintf("%s/%s", repo.Owner, repo.Name)
	}

	repo.Link = target.WebUrl

	if target.GitHttpUrl != "" {
		repo.Clone = target.GitHttpUrl
	} else {
		repo.Clone = target.HttpUrl
	}

	if target.DefaultBranch != "" {
		repo.Branch = target.DefaultBranch
	} else {
		repo.Branch = "master"
	}

	if target.AvatarUrl != "" {
		repo.Avatar = target.AvatarUrl
	}

	build := &model.Build{}
	build.Event = "pull_request"

	lastCommit := obj.LastCommit
	if lastCommit == nil {
		return nil, nil, fmt.Errorf("last_commit key expected in merge request hook")
	}

	build.Message = lastCommit.Message
	build.Commit = lastCommit.Id
	// build.Remote = parsed.ObjectAttributes.Source.HttpUrl

	build.Ref = fmt.Sprintf("refs/merge-requests/%d/head", obj.IId)

	build.Branch = obj.SourceBranch

	author := lastCommit.Author
	if author == nil {
		return nil, nil, fmt.Errorf("author key expected in merge request hook")
	}

	build.Author = author.Name
	build.Email = author.Email

	if len(build.Email) != 0 {
		build.Avatar = GetUserAvatar(build.Email)
	}

	build.Title = obj.Title
	build.Link = obj.Url

	return repo, build, nil
}

func push(parsed *client.HookPayload, req *http.Request) (*model.Repo, *model.Build, error) {
	repo := &model.Repo{}

	// Since gitlab 8.5, used project instead repository key
	// see https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/web_hooks/web_hooks.md#web-hooks
	if project := parsed.Project; project != nil {
		var err error
		if repo.Owner, repo.Name, err = ExtractFromPath(project.PathWithNamespace); err != nil {
			return nil, nil, err
		}

		repo.Avatar = project.AvatarUrl
		repo.Link = project.WebUrl
		repo.Clone = project.GitHttpUrl
		repo.FullName = project.PathWithNamespace
		repo.Branch = project.DefaultBranch

		switch project.VisibilityLevel {
		case 0:
			repo.IsPrivate = true
		case 10:
			repo.IsPrivate = true
		case 20:
			repo.IsPrivate = false
		}
	} else if repository := parsed.Repository; repository != nil {
		repo.Owner = req.FormValue("owner")
		repo.Name = req.FormValue("name")
		repo.Link = repository.URL
		repo.Clone = repository.GitHttpUrl
		repo.Branch = "master"
		repo.FullName = fmt.Sprintf("%s/%s", req.FormValue("owner"), req.FormValue("name"))

		switch repository.VisibilityLevel {
		case 0:
			repo.IsPrivate = true
		case 10:
			repo.IsPrivate = true
		case 20:
			repo.IsPrivate = false
		}
	} else {
		return nil, nil, fmt.Errorf("No project/repository keys given")
	}

	build := &model.Build{}
	build.Event = model.EventPush
	build.Commit = parsed.After
	build.Branch = parsed.Branch()
	build.Ref = parsed.Ref
	// hook.Commit.Remote = cloneUrl

	var head = parsed.Head()
	build.Message = head.Message
	// build.Timestamp = head.Timestamp

	// extracts the commit author (ideally email)
	// from the post-commit hook
	switch {
	case head.Author != nil:
		build.Email = head.Author.Email
		build.Author = parsed.UserName
		if len(build.Email) != 0 {
			build.Avatar = GetUserAvatar(build.Email)
		}
	case head.Author == nil:
		build.Author = parsed.UserName
	}

	if strings.HasPrefix(build.Ref, "refs/tags/") {
		build.Event = model.EventTag
	}

	return repo, build, nil
}

// ¯\_(ツ)_/¯
func (g *Gitlab) Oauth2Transport(r *http.Request) *oauth2.Transport {
	return &oauth2.Transport{
		Config: &oauth2.Config{
			ClientId:     g.Client,
			ClientSecret: g.Secret,
			Scope:        DefaultScope,
			AuthURL:      fmt.Sprintf("%s/oauth/authorize", g.URL),
			TokenURL:     fmt.Sprintf("%s/oauth/token", g.URL),
			RedirectURL:  fmt.Sprintf("%s/authorize", httputil.GetURL(r)),
			// settings.Server.Scheme, settings.Server.Hostname),
		},
		Transport: &http.Transport{
			Proxy:           http.ProxyFromEnvironment,
			TLSClientConfig: &tls.Config{InsecureSkipVerify: g.SkipVerify},
		},
	}
}

// StatusPending ...
const (
	StatusPending  = "pending"
	StatusRunning  = "running"
	StatusSuccess  = "success"
	StatusFailure  = "failed"
	StatusCanceled = "canceled"
)

// DescPending ...
const (
	DescPending  = "the build is pending"
	DescRunning  = "the buils is running"
	DescSuccess  = "the build was successful"
	DescFailure  = "the build failed"
	DescCanceled = "the build canceled"
	DescBlocked  = "the build is pending approval"
	DescDeclined = "the build was rejected"
)

// getStatus is a helper functin that converts a Drone
// status to a GitHub status.
func getStatus(status string) string {
	switch status {
	case model.StatusPending, model.StatusBlocked:
		return StatusPending
	case model.StatusRunning:
		return StatusRunning
	case model.StatusSuccess:
		return StatusSuccess
	case model.StatusFailure, model.StatusError:
		return StatusFailure
	case model.StatusKilled:
		return StatusCanceled
	default:
		return StatusFailure
	}
}

// getDesc is a helper function that generates a description
// message for the build based on the status.
func getDesc(status string) string {
	switch status {
	case model.StatusPending:
		return DescPending
	case model.StatusRunning:
		return DescRunning
	case model.StatusSuccess:
		return DescSuccess
	case model.StatusFailure, model.StatusError:
		return DescFailure
	case model.StatusKilled:
		return DescCanceled
	case model.StatusBlocked:
		return DescBlocked
	case model.StatusDeclined:
		return DescDeclined
	default:
		return DescFailure
	}
}

// Login authenticates the session and returns the
// remote user details.
func (g *Gitlab) Login(res http.ResponseWriter, req *http.Request) (*db.User, error) {
	var config = &oauth2.Config{
		ClientId:     g.Client,
		ClientSecret: g.Secret,
		Scope:        DefaultScope,
		AuthURL:      fmt.Sprintf("%s/oauth/authorize", g.URL),
		TokenURL:     fmt.Sprintf("%s/oauth/token", g.URL),
		// RedirectURL:  fmt.Sprintf("%s/authorize", httputil.GetURL(req)),
		RedirectURL: fmt.Sprintf("%s/api/authorize", conf.GetString("domain")),
	}

	trans_ := &http.Transport{
		Proxy:           http.ProxyFromEnvironment,
		TLSClientConfig: &tls.Config{InsecureSkipVerify: g.SkipVerify},
	}

	// get the OAuth errors
	if err := req.FormValue("error"); err != "" {
		return nil, &remote.AuthError{
			Err:         err,
			Description: req.FormValue("error_description"),
			URI:         req.FormValue("error_uri"),
		}
	}

	// get the OAuth code
	var code = req.FormValue("code")
	if len(code) == 0 {
		http.Redirect(res, req, config.AuthCodeURL("gitbook"), http.StatusSeeOther)
		return nil, nil
	}

	var trans = &oauth2.Transport{Config: config, Transport: trans_}
	var token_, err = trans.Exchange(code)
	if err != nil {
		return nil, fmt.Errorf("Error exchanging token. %s", err)
	}

	client := NewClient(g.URL, token_.AccessToken, g.SkipVerify)
	login, err := client.CurrentUser()
	if err != nil {
		return nil, err
	}

	oaFlag := false
	user := &db.User{}

	for _, value := range login.Identities {
		if value.Provider == "OA" {
			oaFlag = true
			uidTmp, err := strconv.Atoi(value.ExternUid)
			if err != nil {
				return nil, errors.New("no oa uid1")
			}
			user.Oaid = uidTmp
		}
	}

	if !oaFlag {
		return nil, errors.New("no oa uid2")
	}

	user.Uid = login.Id
	user.Username = login.Username
	user.Nickname = login.Name
	user.Email = login.Email
	user.WebUrl = login.WebUrl
	user.State = login.State
	user.Token = token_.AccessToken
	user.Secret = token_.RefreshToken

	if strings.HasPrefix(login.AvatarUrl, "http") {
		user.Avatar = login.AvatarUrl
	} else {
		user.Avatar = g.URL + "/" + login.AvatarUrl
	}

	return user, nil
}
