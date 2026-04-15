package models

type ClientStatus string

const (
	Active   ClientStatus = "active"
	InActive ClientStatus = "in_active"
	Lead     ClientStatus = "lead"
	Rejected ClientStatus = "rejected"
)

type Client struct {
	BaseModel
	Name   string       `json:"name" gorm:"not null"`
	Email  string       `json:"email" gorm:"unique;not null"`
	About  string       `json:"about" gorm:"not null"`
	Status ClientStatus `json:"status" gorm:"type:status;default:'lead'"`
	Phone  string       `json:"phone" gorm:"not null"`
}
