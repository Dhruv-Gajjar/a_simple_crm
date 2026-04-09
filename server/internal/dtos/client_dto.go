package dtos

import "gorm.io/gorm"

type Status string

const (
	Active   Status = "active"
	InActive Status = "in_active"
	Lead     Status = "lead"
	Rejected Status = "rejected"
)

type ClientDto struct {
	ID     uint
	Name   string
	Email  string
	About  string
	Status Status
	Number string
}

type CreateClientDto struct {
	Name   string
	Email  string
	About  string
	Status Status
	Number string
}

type ClientResponseDto struct {
	gorm.Model
	Name   string
	Email  string
	About  string
	Status Status
	Number string
}
