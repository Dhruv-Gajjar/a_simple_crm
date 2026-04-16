package models

import (
	"time"

	"github.com/google/uuid"
)

type Notes struct {
	ID        uuid.UUID `json:"id" gorm:"primaryKey"`
	ProjectID uuid.UUID `json:"project_id" gorm:"not null"`
	Content   string    `json:"content" gorm:"type:text;not null"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
