package models

import (
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	Todo       Status = "todo"
	Completed  Status = "completed"
	OnHold     Status = "on_hold"
	InProgress Status = "in_progress"
	Canceled   Status = "canceled"
)

type Projects struct {
	BaseModel
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description"`
	Status      Status `json:"status" gorm:"column:status;default:'todo'"`
	ClientID    uuid.UUID
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	TotalCost   float64   `json:"total_cost" gorm:"type:decimal(10,1);default:0.00;not null"`
	Iterations  int       `json:"iterations" gorm:"default:0;not null"`

	Transactions []Transactions `json:"transactions,omitempty" gorm:"foreignKey:ProjectID"`
	Notes        []Notes        `json:"notes,omitempty" gorm:"foreignKey:ProjectID"`
	Invoices     []Invoices     `json:"invoices,omitempty" gorm:"foreignKey:ProjectID"`
}
