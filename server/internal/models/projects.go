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
	Status      Status `json:"status" gorm:"type:status;default:'todo'"`
	ClientID    uuid.UUID
	Client      Client    `gorm:"foreignKey:ClientID"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
}
