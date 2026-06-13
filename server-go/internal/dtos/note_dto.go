package dtos

import "github.com/google/uuid"

type NoteDto struct {
	ID        uuid.UUID
	ProjectID uuid.UUID
	Content   string
}

type CreateNoteDto struct {
	ProjectID uuid.UUID
	Content   string
}
