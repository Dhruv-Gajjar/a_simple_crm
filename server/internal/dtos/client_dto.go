package dtos

import (
	"founder-diary/internal/models"

	"github.com/google/uuid"
)

type ClientDto struct {
	ID           uuid.UUID
	Name         string
	Email        string
	Soruce       string
	ClientStatus models.ClientStatus
	PhoneNumber  string
	Remarks      string
	Projects     []models.Projects
}

type CreateClientDto struct {
	Name         string
	Email        string
	Soruce       string
	ClientStatus models.ClientStatus
	PhoneNumber  string
	Remarks      string
}
