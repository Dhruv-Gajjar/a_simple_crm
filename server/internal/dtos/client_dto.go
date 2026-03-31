package dto

import "gorm.io/gorm"

type Status string

const (
	ACTIVE    Status = "active"
	IN_ACTIVE Status = "in_active"
	LEAD      Status = "lead"
	REJECTED  Status = "rejected"
)

type ClientDto struct {
	ID     uint
	Name   string
	Email  string
	Status Status
	Number string
}

type ClientResponseDto struct {
	gorm.Model
	Name   string
	Email  string
	Status Status
	Number string
}
