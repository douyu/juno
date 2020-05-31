package model

// EventPush ...
const (
	EventPush   = "push"
	EventPull   = "pull_request"
	EventTag    = "tag"
	EventDeploy = "deployment"
)

// StatusSkipped ...
const (
	StatusSkipped  = "skipped"
	StatusPending  = "pending"
	StatusRunning  = "running"
	StatusSuccess  = "success"
	StatusFailure  = "failure"
	StatusKilled   = "killed"
	StatusError    = "error"
	StatusBlocked  = "blocked"
	StatusDeclined = "declined"
)

// RepoGit ...
const (
	RepoGit      = "git"
	RepoHg       = "hg"
	RepoFossil   = "fossil"
	RepoPerforce = "perforce"
)

// VisibilityPublic ...
const (
	VisibilityPublic   = "public"
	VisibilityPrivate  = "private"
	VisibilityInternal = "internal"
)
