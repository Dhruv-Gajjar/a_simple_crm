package repositories

import (
	"context"
	"errors"
	"fmt"
	"founder-diary/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ClientRepository interface {
	BaseReporitory[models.Clients]
	GetAllClientsCount(ctx context.Context, entity []*models.Clients) (*models.ClientResponse, error)
}

type clientRepository struct {
	db *gorm.DB
}

func NewClientRepository(db *gorm.DB) ClientRepository {
	return &clientRepository{db: db}
}

var _ ClientRepository = (*clientRepository)(nil)

func (r *clientRepository) GetAll(ctx context.Context, entity []*models.Clients) ([]*models.Clients, error) {
	clients := entity

	result := r.db.WithContext(ctx).Preload("Projects").Find(&clients)

	if result.Error != nil {
		return nil, result.Error
	}

	return clients, nil
}

func (r *clientRepository) GetAllClientsCount(ctx context.Context, entity []*models.Clients) (*models.ClientResponse, error) {
	clients := entity

	type Stats struct {
		Total  int64
		Active int64
	}

	var stats Stats
	countErr := r.db.Model(clients).Select("COUNT(*) as total, COUNT(*) FILTER(WHERE status = 'active') as active").Scan(&stats).Error

	if countErr != nil {
		fmt.Printf("Get All Clients Count: %v", countErr)
		return nil, countErr
	}

	result := r.db.WithContext(ctx).Preload("Projects").Where("status = ?", "active").Find(&clients)

	if result.Error != nil {
		return nil, result.Error
	}

	return &models.ClientResponse{
		ActiveClients: clients,
		Total:         stats.Total,
		Active:        stats.Active,
	}, nil
}

func (r *clientRepository) Create(ctx context.Context, entity *models.Clients) (*models.Clients, error) {
	client := entity
	result := r.db.WithContext(ctx).Create(client)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, ErrDuplicate
		}
		return nil, result.Error
	}

	return client, nil
}

func (r *clientRepository) GetByID(ctx context.Context, entity *models.Clients, id uuid.UUID) (*models.Clients, error) {
	client := entity

	result := r.db.WithContext(ctx).First(&client, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, ErrDuplicate
		}
		return nil, result.Error
	}

	return client, nil
}

func (r *clientRepository) Update(ctx context.Context, entity *models.Clients, id uuid.UUID) (*models.Clients, error) {
	client := entity

	result := r.db.WithContext(ctx).Where("id = ?", id).Updates(&client)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return client, nil
}

func (r *clientRepository) Delete(ctx context.Context, entity *models.Clients, id uuid.UUID) (*models.Clients, error) {
	client := entity

	result := r.db.WithContext(ctx).Delete(&models.Clients{}, id)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return client, nil
}
