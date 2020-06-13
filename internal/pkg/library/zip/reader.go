package zip

import "archive/zip"

// ReaderFilList ...
func ReaderFilList(filename string) ([]string, error) {
	var names = make([]string, 0)
	r, err := zip.OpenReader(filename)
	if err != nil {
		return names, err
	}
	defer r.Close()

	for _, file := range r.File {
		names = append(names, file.Name)
	}

	return names, nil
}
