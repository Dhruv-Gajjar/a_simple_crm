package models

import (
	"time"

	"github.com/google/uuid"
)

type Tasks struct {
	BaseModel
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description"`
	Status      Status `json:"status" gorm:"type:status;default:'todo'"`
	ProjectID   uuid.UUID
	Project     Projects  `gorm:"foreignKey:ProjectID"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
}
