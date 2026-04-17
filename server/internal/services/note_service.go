package services

import (
	"context"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"

	"github.com/google/uuid"
)

type NotesService interface {
	GetAll(ctx context.Context, notes []*models.Notes) ([]*models.Notes, error)
	Create(ctx context.Context, input *dtos.CreateNoteDto) (*models.Notes, error)
	Update(ctx context.Context, input *dtos.NoteDto, id uuid.UUID) (*models.Notes, error)
}

type notesService struct {
	repo repositories.NoteRepository
}

func NewNotesService(repo repositories.NoteRepository) NotesService {
	return &notesService{repo: repo}
}

var _ NotesService = (*notesService)(nil)

func (s *notesService) GetAll(ctx context.Context, notes []*models.Notes) ([]*models.Notes, error) {
	return s.repo.GetAll(ctx, notes)
}

func (s *notesService) Create(ctx context.Context, input *dtos.CreateNoteDto) (*models.Notes, error) {
	return s.repo.Create(ctx, input)
}

func (s *notesService) Update(ctx context.Context, input *dtos.NoteDto, id uuid.UUID) (*models.Notes, error) {
	return s.repo.Update(ctx, input, id)
}
