package client

import "time"

// QMap ...
type QMap map[string]string

// User ...
type User struct {
	Id         int          `json:"id,omitempty"`
	Username   string       `json:"username,omitempty"`
	State      string       `json:"state,omitempty"`
	Email      string       `json:"email,omitempty"`
	AvatarUrl  string       `json:"avatar_url,omitempty"`
	WebUrl     string       `json:"web_url,omitempty"`
	Name       string       `json:"name,omitempty"`
	Identities []Identities `json:"identities,omitempty"`
}

// Identities ...
type Identities struct {
	Provider  string `json:"provider,omitempty"`
	ExternUid string `json:"extern_uid,omitempty"`
}

// ProjectAccess ...
type ProjectAccess struct {
	AccessLevel       int `json:"access_level,omitempty"`
	NotificationLevel int `json:"notification_level,omitempty"`
}

// GroupAccess ...
type GroupAccess struct {
	AccessLevel       int `json:"access_level,omitempty"`
	NotificationLevel int `json:"notification_level,omitempty"`
}

// Permissions ...
type Permissions struct {
	ProjectAccess *ProjectAccess `json:"project_access,omitempty"`
	GroupAccess   *GroupAccess   `json:"group_access,omitempty"`
}

// Member ...
type Member struct {
	Id        int
	Username  string
	Email     string
	Name      string
	State     string
	CreatedAt string `json:"created_at,omitempty"`
	// AccessLevel int
}

// Project ...
type Project struct {
	Id                int          `json:"id,omitempty"`
	Owner             *Member      `json:"owner,omitempty"`
	Name              string       `json:"name,omitempty"`
	Description       string       `json:"description,omitempty"`
	DefaultBranch     string       `json:"default_branch,omitempty"`
	Public            bool         `json:"public,omitempty"`
	Path              string       `json:"path,omitempty"`
	PathWithNamespace string       `json:"path_with_namespace,omitempty"`
	Namespace         *Namespace   `json:"namespace,omitempty"`
	SshRepoUrl        string       `json:"ssh_url_to_repo"`
	HttpRepoUrl       string       `json:"http_url_to_repo"`
	Url               string       `json:"web_url"`
	AvatarUrl         string       `json:"avatar_url"`
	Permissions       *Permissions `json:"permissions,omitempty"`
	CreatorId         int          `json:"creator_id,omitempty"`
}

// Namespace ...
type Namespace struct {
	Id   int    `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	Path string `json:"path,omitempty"`
}

// Person ...
type Person struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type hProject struct {
	Name              string `json:"name"`
	SshUrl            string `json:"ssh_url"`
	HttpUrl           string `json:"http_url"`
	GitSshUrl         string `json:"git_ssh_url"`
	GitHttpUrl        string `json:"git_http_url"`
	AvatarUrl         string `json:"avatar_url"`
	VisibilityLevel   int    `json:"visibility_level"`
	WebUrl            string `json:"web_url"`
	PathWithNamespace string `json:"path_with_namespace"`
	DefaultBranch     string `json:"default_branch"`
	Namespace         string `json:"namespace"`
}

type hRepository struct {
	Name            string `json:"name,omitempty"`
	URL             string `json:"url,omitempty"`
	Description     string `json:"description,omitempty"`
	Homepage        string `json:"homepage,omitempty"`
	GitHttpUrl      string `json:"git_http_url,omitempty"`
	GitSshUrl       string `json:"git_ssh_url,omitempty"`
	VisibilityLevel int    `json:"visibility_level,omitempty"`
}

type hCommit struct {
	Id        string  `json:"id,omitempty"`
	Message   string  `json:"message,omitempty"`
	Timestamp string  `json:"timestamp,omitempty"`
	URL       string  `json:"url,omitempty"`
	Author    *Person `json:"author,omitempty"`
}

// HookObjAttr ...
type HookObjAttr struct {
	Id              int       `json:"id,omitempty"`
	Title           string    `json:"title,omitempty"`
	AssigneeId      int       `json:"assignee_id,omitempty"`
	AuthorId        int       `json:"author_id,omitempty"`
	ProjectId       int       `json:"project_id,omitempty"`
	CreatedAt       string    `json:"created_at,omitempty"`
	UpdatedAt       string    `json:"updated_at,omitempty"`
	Position        int       `json:"position,omitempty"`
	BranchName      string    `json:"branch_name,omitempty"`
	Description     string    `json:"description,omitempty"`
	MilestoneId     int       `json:"milestone_id,omitempty"`
	State           string    `json:"state,omitempty"`
	IId             int       `json:"iid,omitempty"`
	TargetBranch    string    `json:"target_branch,omitempty"`
	SourceBranch    string    `json:"source_branch,omitempty"`
	SourceProjectId int       `json:"source_project_id,omitempty"`
	StCommits       string    `json:"st_commits,omitempty"`
	StDiffs         string    `json:"st_diffs,omitempty"`
	MergeStatus     string    `json:"merge_status,omitempty"`
	TargetProjectId int       `json:"target_project_id,omitempty"`
	Url             string    `json:"url,omiyempty"`
	Source          *hProject `json:"source,omitempty"`
	Target          *hProject `json:"target,omitempty"`
	LastCommit      *hCommit  `json:"last_commit,omitempty"`
}

// HookPayload ...
type HookPayload struct {
	Before            string       `json:"before,omitempty"`
	After             string       `json:"after,omitempty"`
	Ref               string       `json:"ref,omitempty"`
	UserId            int          `json:"user_id,omitempty"`
	UserName          string       `json:"user_name,omitempty"`
	ProjectId         int          `json:"project_id,omitempty"`
	Project           *hProject    `json:"project,omitempty"`
	Repository        *hRepository `json:"repository,omitempty"`
	Commits           []hCommit    `json:"commits,omitempty"`
	TotalCommitsCount int          `json:"total_commits_count,omitempty"`
	ObjectKind        string       `json:"object_kind,omitempty"`
	ObjectAttributes  *HookObjAttr `json:"object_attributes,omitempty"`
}

// FileRef ...
type FileRef struct {
	FileName     string `json:"file_name,omitempty"`
	FilePath     string `json:"file_path,omitempty"`
	Size         int    `json:"size,omitempty"`
	Encoding     string `json:"encoding,omitempty"`
	Content      string `json:"content"`
	Ref          string `json:"ref,omitempty"`
	BlobId       string `json:"blob_id,omitempty"`
	CommitId     string `json:"commit_id,omitempty"`
	LastCommitId string `json:"last_commit_id,omitempty"`
}

// SingleProject ...
type SingleProject struct {
	ID            int      `json:"id"`
	Description   string   `json:"description"`
	DefaultBranch string   `json:"default_branch"`
	Visibility    string   `json:"visibility"`
	SSHURLToRepo  string   `json:"ssh_url_to_repo"`
	HTTPURLToRepo string   `json:"http_url_to_repo"`
	WebURL        string   `json:"web_url"`
	TagList       []string `json:"tag_list"`
	Owner         struct {
		ID        int       `json:"id"`
		Name      string    `json:"name"`
		CreatedAt time.Time `json:"created_at"`
	} `json:"owner"`
	Name                           string    `json:"name"`
	NameWithNamespace              string    `json:"name_with_namespace"`
	Path                           string    `json:"path"`
	PathWithNamespace              string    `json:"path_with_namespace"`
	IssuesEnabled                  bool      `json:"issues_enabled"`
	OpenIssuesCount                int       `json:"open_issues_count"`
	MergeRequestsEnabled           bool      `json:"merge_requests_enabled"`
	JobsEnabled                    bool      `json:"jobs_enabled"`
	WikiEnabled                    bool      `json:"wiki_enabled"`
	SnippetsEnabled                bool      `json:"snippets_enabled"`
	ResolveOutdatedDiffDiscussions bool      `json:"resolve_outdated_diff_discussions"`
	ContainerRegistryEnabled       bool      `json:"container_registry_enabled"`
	CreatedAt                      time.Time `json:"created_at"`
	LastActivityAt                 time.Time `json:"last_activity_at"`
	CreatorID                      int       `json:"creator_id"`
	Namespace                      struct {
		ID       int    `json:"id"`
		Name     string `json:"name"`
		Path     string `json:"path"`
		Kind     string `json:"kind"`
		FullPath string `json:"full_path"`
	} `json:"namespace"`
	ImportStatus string `json:"import_status"`
	ImportError  string `json:"import_error"`
	Permissions  struct {
		ProjectAccess struct {
			AccessLevel       int `json:"access_level"`
			NotificationLevel int `json:"notification_level"`
		} `json:"project_access"`
		GroupAccess struct {
			AccessLevel       int `json:"access_level"`
			NotificationLevel int `json:"notification_level"`
		} `json:"group_access"`
	} `json:"permissions"`
	Archived             bool   `json:"archived"`
	AvatarURL            string `json:"avatar_url"`
	SharedRunnersEnabled bool   `json:"shared_runners_enabled"`
	ForksCount           int    `json:"forks_count"`
	StarCount            int    `json:"star_count"`
	RunnersToken         string `json:"runners_token"`
	PublicJobs           bool   `json:"public_jobs"`
	SharedWithGroups     []struct {
		GroupID          int    `json:"group_id"`
		GroupName        string `json:"group_name"`
		GroupAccessLevel int    `json:"group_access_level"`
	} `json:"shared_with_groups"`
	OnlyAllowMergeIfPipelineSucceeds          bool `json:"only_allow_merge_if_pipeline_succeeds"`
	OnlyAllowMergeIfAllDiscussionsAreResolved bool `json:"only_allow_merge_if_all_discussions_are_resolved"`
	PrintingMergeRequestsLinkEnabled          bool `json:"printing_merge_requests_link_enabled"`
	RequestAccessEnabled                      bool `json:"request_access_enabled"`
	Statistics                                struct {
		CommitCount      int `json:"commit_count"`
		StorageSize      int `json:"storage_size"`
		RepositorySize   int `json:"repository_size"`
		LfsObjectsSize   int `json:"lfs_objects_size"`
		JobArtifactsSize int `json:"job_artifacts_size"`
	} `json:"statistics"`
	Links struct {
		Self          string `json:"self"`
		Issues        string `json:"issues"`
		MergeRequests string `json:"merge_requests"`
		RepoBranches  string `json:"repo_branches"`
		Labels        string `json:"labels"`
		Events        string `json:"events"`
		Members       string `json:"members"`
	} `json:"_links"`
}

// SingleSimpleProject ...
type SingleSimpleProject struct {
	ID                int       `json:"id"`
	Description       string    `json:"description"`
	DefaultBranch     string    `json:"default_branch"`
	SSHURLToRepo      string    `json:"ssh_url_to_repo"`
	HTTPURLToRepo     string    `json:"http_url_to_repo"`
	WebURL            string    `json:"web_url"`
	Name              string    `json:"name"`
	NameWithNamespace string    `json:"name_with_namespace"`
	Path              string    `json:"path"`
	PathWithNamespace string    `json:"path_with_namespace"`
	CreatedAt         time.Time `json:"created_at"`
	LastActivityAt    time.Time `json:"last_activity_at"`
}

// Commit ...
type Commit struct {
	AuthorEmail    string   `json:"author_email"`
	AuthorName     string   `json:"author_name"`
	AuthoredDate   string   `json:"authored_date"`
	CommittedDate  string   `json:"committed_date"`
	CommitterEmail string   `json:"committer_email"`
	CommitterName  string   `json:"committer_name"`
	ID             string   `json:"id"`
	ShortID        string   `json:"short_id"`
	Title          string   `json:"title"`
	Message        string   `json:"message"`
	ParentIds      []string `json:"parent_ids"`
}

// SingleBranch ...
type SingleBranch struct {
	Name               string `json:"name"`
	Merged             bool   `json:"merged"`
	Protected          bool   `json:"protected"`
	DevelopersCanPush  bool   `json:"developers_can_push"`
	DevelopersCanMerge bool   `json:"developers_can_merge"`
	Commit             Commit `json:"commit"`
}

// SingleCommit ...
type SingleCommit struct {
	ID             string    `json:"id"`
	ShortID        string    `json:"short_id"`
	Title          string    `json:"title"`
	AuthorName     string    `json:"author_name"`
	AuthorEmail    string    `json:"author_email"`
	CommitterName  string    `json:"committer_name"`
	CommitterEmail string    `json:"committer_email"`
	CreatedAt      time.Time `json:"created_at"`
	Message        string    `json:"message"`
	CommittedDate  time.Time `json:"committed_date"`
	AuthoredDate   time.Time `json:"authored_date"`
	ParentIds      []string  `json:"parent_ids"`
	LastPipeline   struct {
		ID     int    `json:"id"`
		Ref    string `json:"ref"`
		Sha    string `json:"sha"`
		Status string `json:"status"`
	} `json:"last_pipeline"`
	Stats struct {
		Additions int `json:"additions"`
		Deletions int `json:"deletions"`
		Total     int `json:"total"`
	} `json:"stats"`
	Status string `json:"status"`
}

// AddDeployKey ...
type AddDeployKey struct {
	Key       string    `json:"key"`
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	CanPush   bool      `json:"can_push"`
	CreatedAt time.Time `json:"created_at"`
}

// AddProjectHook ...
type AddProjectHook struct {
	ID                       int       `json:"id"`
	URL                      string    `json:"url"`
	ProjectID                int       `json:"project_id"`
	PushEvents               bool      `json:"push_events"`
	IssuesEvents             bool      `json:"issues_events"`
	ConfidentialIssuesEvents bool      `json:"confidential_issues_events"`
	MergeRequestsEvents      bool      `json:"merge_requests_events"`
	TagPushEvents            bool      `json:"tag_push_events"`
	NoteEvents               bool      `json:"note_events"`
	JobEvents                bool      `json:"job_events"`
	PipelineEvents           bool      `json:"pipeline_events"`
	WikiPageEvents           bool      `json:"wiki_page_events"`
	EnableSslVerification    bool      `json:"enable_ssl_verification"`
	CreatedAt                time.Time `json:"created_at"`
}

// SingleTag ...
type SingleTag struct {
	Name   string `json:"name"`
	Target string `json:"target"`
	Commit Commit `json:"commit"`
}

type RepoFile struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
	Path string `json:"path"`
	Mode string `json:"mode"`
}

type FileContent struct {
	FileName     string `json:"file_name"`
	FilePath     string `json:"file_path"`
	Size         int64  `json:"size"`
	Encoding     string `json:"encoding"`
	Content      string `json:"content"`
	Ref          string `json:"ref"`
	BlobId       string `json:"blob_id"`
	CommitId     string `json:"commit_id"`
	LastCommitId string `json:"last_commit_id"`
}

const (
	RepoFileTypeBlob = "blob"
	RepoFileTypeTree = "tree"
)

type Jobdata struct {
	ID          int64   `json:"id"`
	Status      string  `json:"status"`
	Stage       string  `json:"stage"`
	Name        string  `json:"name"`
	Ref         string  `json:"ref"`
	Tag         bool    `json:"tag"`
	Coverage    float64 `json:"coverage"`
	Created_at  string  `json:"created_at"`
	Started_at  string  `json:"started_at"`
	Finished_at string  `json:"finished_at"`
	Duration    float64 `json:"duration"`
	User        struct {
		ID           int64  `json:"id"`
		Name         string `json:"name"`
		UserName     string `json:"username"`
		State        string `json:"state"`
		Avatar_url   string `json:"avatar_url"`
		Web_url      string `json:"web_url"`
		Created_at   string `json:"created_at"`
		Bio          string `json:"bio"`
		Location     string `json:"location"`
		Public_email string `json:"public_email"`
		Skype        string `json:"skype"`
		Linkedin     string `json:"linkedin"`
		Twitter      string `json:"twitter"`
		Website_url  string `json:"website_url"`
		Organization string `json:"organization"`
	} `json:"user"`
	Commit struct {
		ID              string   `json:"id"`
		Short_id        string   `json:"short_id"`
		Created_at      string   `json:"created_at"`
		Parent_ids      []string `json:"parent_ids"`
		Title           string   `json:"title"`
		Message         string   `json:"message"`
		Author_name     string   `json:"author_name"`
		Author_email    string   `json:"author_email"`
		Authored_date   string   `json:"authored_date"`
		Committer_name  string   `json:"committer_name"`
		Committer_email string   `json:"committer_email"`
		Committed_date  string   `json:"committed_date"`
	} `json:"commit"`
	pipeline struct {
		ID      int64  `json:"id"`
		Sha     string `json:"sha"`
		Ref     string `json:"ref"`
		Status  string `json:"status"`
		Web_url string `json:"web_url"`
	} `json:"pipeline"`
	Web_url   string `json:"web_url"`
	Artifacts []struct {
		File_type   string `json:"file_type"`
		Size        int64  `json:"size"`
		Filename    string `json:"filename"`
		File_format string `json:"file_format"`
	} `json:"artifacts"`
	Runner struct {
		ID          int64  `json:"id"`
		Description string `json:"description"`
		Ip_address  string `json:"ip_address"`
		Active      bool   `json:"active"`
		Is_shared   bool   `json:"is_shared"`
		Name        string `json:"name"`
		Online      bool   `json:"online"`
		Status      string `json:"status"`
	} `json:"runner"`
	Artifacts_expire_at string `json:"artifacts_expire_at"`
}
