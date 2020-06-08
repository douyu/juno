package parse

// TargetText: toml、yaml、ini, Configuration files stored in the database
// Different types of configurations have their own parser
// Json -> typ, merge with the original configuration file, and then return
type Parse interface {
	// Convert the json data stored in the template to the target format
	Convert(text string) ([]byte, error)

	// Fusion Multi-configuration data fusion
	Fusion(sources []string) (string, error)

	// FusionWithTpl Config combine with json
	FusionWithTpl(sources string, texts []string) (string, error)

	// IsLegal whether the format meets the specifications
	Format(source []byte) (string, error)
}
