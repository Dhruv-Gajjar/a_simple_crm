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
	Source      string       `json:"source" gorm:"not null"`
	Status      ClientStatus `json:"status" gorm:"column:status;default:'lead'"`
	PhoneNumber string       `json:"phone_number" gorm:"not null"`
	Remarks     string       `json:"remarks,omitempty"`
	Projects    []Projects   `gorm:"foreignKey:ClientID"`
}

type ClientResponse struct {
	ActiveClients []*Clients
	Total         int64
	Active        int64
}
