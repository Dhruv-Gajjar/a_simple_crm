package dtos

import (
	"founder-diary/internal/models"
	"time"

	"github.com/google/uuid"
)

type ProjectDTO struct {
	ID          uuid.UUID
	Name        string
	Description string
	Status      models.Status
	ClientID    uuid.UUID
	StartDate   time.Time
	EndDate     time.Time
}

type CreateProjectDTO struct {
	Name        string
	Description string
	Status      models.Status
	ClientID    uuid.UUID
	StartDate   time.Time
	EndDate     time.Time
}
