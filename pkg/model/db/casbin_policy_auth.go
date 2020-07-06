package db

type CasbinPolicyAuth struct {
	Model
	Sub  string `gorm:"not null;"json:"sub"`
	Obj  string `gorm:"not null;"json:"obj"`
	Act  string `gorm:"not null;"json:"act"`
	Type int    `gorm:"not null;"json:"type"` // 1,2,3 , 4,5,6
}

func (c CasbinPolicyAuth) TableName() string {
	return "casbin_policy_auth"
}
