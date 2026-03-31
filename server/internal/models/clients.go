package models

import "gorm.io/gorm"

type Status string

const (
	ACTIVE    Status = "active"
	IN_ACTIVE Status = "in_active"
	LEAD      Status = "lead"
	REJECTED  Status = "rejected"
)

type Client struct {
	gorm.Model
	Name   string `json:"name" gorm:"not null"`
	Email  string `json:"email" gorm:"unique;not null"`
	Status Status `json:"status" gorm:"type:varchar(20);default:'lead'"`
	Number string `json:"number" gorm:"unique;not null"`
}
