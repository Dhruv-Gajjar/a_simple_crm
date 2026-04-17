package repositories

import (
	"context"
	"errors"
	"founder-diary/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectRepository interface {
	BaseReporitory[models.Projects]
}

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepository{db: db}
}

var _ ProjectRepository = (*projectRepository)(nil)

func (r *projectRepository) GetAll(ctx context.Context, entity []*models.Projects) ([]*models.Projects, error) {
	var projects []*models.Projects

	result := r.db.WithContext(ctx).Find(&projects)

	if result.Error != nil {
		return nil, result.Error
	}
	return projects, nil
}

func (r *projectRepository) GetByID(ctx context.Context, entity *models.Projects, id uuid.UUID) (*models.Projects, error) {
	project := entity

	result := r.db.WithContext(ctx).First(&project, id)

	if result.Error != nil {
		return nil, result.Error
	}

	return project, nil
}

func (r *projectRepository) Create(ctx context.Context, entity *models.Projects) (*models.Projects, error) {
	project := entity
	result := r.db.WithContext(ctx).Create(project)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, ErrDuplicate
		}

		return nil, result.Error
	}
	return project, nil
}

func (r *projectRepository) Update(ctx context.Context, entity *models.Projects, id uuid.UUID) (*models.Projects, error) {
	project := entity

	result := r.db.WithContext(ctx).Where("id = ?", id).Updates(&project)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return project, nil
}

func (r *projectRepository) Delete(ctx context.Context, entity *models.Projects, id uuid.UUID) (*models.Projects, error) {
	project := entity

	result := r.db.WithContext(ctx).Delete(&project, id)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return project, nil
}
