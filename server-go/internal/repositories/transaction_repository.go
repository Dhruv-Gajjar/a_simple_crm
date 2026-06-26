package repositories

import (
	"context"
	"errors"
	"founder-diary/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionRepository interface {
	BaseReporitory[models.Transactions]
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db: db}
}

var _ TransactionRepository = (*transactionRepository)(nil)

func (r *transactionRepository) GetAll(ctx context.Context, entities []*models.Transactions) ([]*models.Transactions, error) {
	transactions := entities

	result := r.db.WithContext(ctx).Find(&transactions)

	if result.Error != nil {
		return nil, result.Error
	}

	return transactions, nil
}

func (r *transactionRepository) Create(ctx context.Context, entity *models.Transactions) (*models.Transactions, error) {
	transaction := entity
	result := r.db.WithContext(ctx).Create(transaction)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, ErrDuplicate
		}
		return nil, result.Error
	}

	return transaction, nil
}

func (r *transactionRepository) GetByID(ctx context.Context, entity *models.Transactions, id uuid.UUID) (*models.Transactions, error) {
	transaction := entity

	result := r.db.WithContext(ctx).First(&transaction, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, ErrDuplicate
		}
		return nil, result.Error
	}

	return transaction, nil
}

func (r *transactionRepository) Update(ctx context.Context, entity *models.Transactions, id uuid.UUID) (*models.Transactions, error) {
	transaction := entity

	result := r.db.WithContext(ctx).Where("id = ?", id).Updates(&transaction)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return transaction, nil
}

func (r *transactionRepository) Delete(ctx context.Context, entity *models.Transactions, id uuid.UUID) (*models.Transactions, error) {
	transaction := entity

	result := r.db.WithContext(ctx).Delete(&transaction, id)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return transaction, nil
}
