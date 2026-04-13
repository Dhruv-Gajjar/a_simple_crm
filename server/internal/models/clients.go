package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Status string

const (
	Active   Status = "active"
	InActive Status = "in_active"
	Lead     Status = "lead"
	Rejected Status = "rejected"
)

type Client struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name      string         `json:"name" gorm:"not null"`
	Email     string         `json:"email" gorm:"unique;not null"`
	About     string         `json:"about" gorm:"not null"`
	Status    Status         `json:"status" gorm:"type:status;default:'lead'"`
	Phone     string         `json:"phone" gorm:"not null"`
}
