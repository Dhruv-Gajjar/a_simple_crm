package repositories

import (
	"context"
	"founder-diary/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NoteRepository interface {
	BaseReporitory[models.Notes]
}

type noteRepository struct {
	db *gorm.DB
}

func NewNoteRepository(db *gorm.DB) NoteRepository {
	return &noteRepository{db: db}
}

var _ NoteRepository = (*noteRepository)(nil)

func (r *noteRepository) GetAll(ctx context.Context, entities []*models.Notes) ([]*models.Notes, error) {
	notes := entities

	result := r.db.WithContext(ctx).Find(&notes)

	if result.Error != nil {
		return nil, result.Error
	}

	return notes, nil
}

func (r *noteRepository) GetByID(ctx context.Context, entity *models.Notes, id uuid.UUID) (*models.Notes, error) {
	note := entity

	result := r.db.WithContext(ctx).First(&note, id)

	if result.Error != nil {
		return nil, result.Error
	}

	return note, nil
}

func (r *noteRepository) Create(ctx context.Context, entity *models.Notes) (*models.Notes, error) {
	note := entity

	result := r.db.WithContext(ctx).Create(&note)

	if result.Error != nil {
		return nil, result.Error
	}

	return note, nil
}

func (r *noteRepository) Update(ctx context.Context, entity *models.Notes, id uuid.UUID) (*models.Notes, error) {
	note := entity

	result := r.db.WithContext(ctx).Where("id = ?", id).Updates(&note)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return note, nil
}

func (r *noteRepository) Delete(ctx context.Context, entity *models.Notes, id uuid.UUID) (*models.Notes, error) {
	note := entity

	result := r.db.WithContext(ctx).Delete(&note, id)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return note, nil
}
