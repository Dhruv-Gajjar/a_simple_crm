package models

type ClientStatus string

const (
	Active   ClientStatus = "active"
	InActive ClientStatus = "in_active"
	Lead     ClientStatus = "lead"
	Rejected ClientStatus = "rejected"
)

type Clients struct {
	BaseModel
	Name        string       `json:"name" gorm:"not null"`
	Email       string       `json:"email" gorm:"unique;not null"`
	Soruce      string       `json:"soruce" gorm:"not null"`
	Status      ClientStatus `json:"status" gorm:"type:status;default:'lead'"`
	PhoneNumber string       `json:"phone_number" gorm:"not null"`
	Remarks     string       `json:"remarks,omitempty"`
	Projects    []Projects   `json:"projects,omitempty" gorm:"foreignKey:ClientID"`
}
