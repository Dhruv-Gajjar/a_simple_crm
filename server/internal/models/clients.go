package models

import "gorm.io/gorm"

type Status string

const (
	Active   Status = "active"
	InActive Status = "in_active"
	Lead     Status = "lead"
	Rejected Status = "rejected"
)

type Client struct {
	gorm.Model
	Name   string `json:"name" gorm:"not null"`
	Email  string `json:"email" gorm:"unique;not null"`
	Status Status `json:"status" gorm:"type:varchar(20);default:'lead'"`
	Number string `json:"number" gorm:"unique;not null"`
}
