package services

import (
	"context"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"

	"github.com/google/uuid"
)

type TransactionService interface {
	GetAll(ctx context.Context, transactions []*models.Transactions) ([]*models.Transactions, error)
	GetByID(ctx context.Context, transaction *models.Transactions, id uuid.UUID) (*models.Transactions, error)
	Create(ctx context.Context, transaction *dtos.CreateTransactionDto) (*models.Transactions, error)
	Update(ctx context.Context, client *dtos.TransactionDto, id uuid.UUID) (*models.Transactions, error)
	Delete(ctx context.Context, client *models.Transactions, id uuid.UUID) (*models.Transactions, error)
}

type transactionService struct {
	repo repositories.TransactionRepository
}

func NewTransactionService(repo repositories.TransactionRepository) TransactionService {
	return &transactionService{repo: repo}
}

var _ TransactionService = (*transactionService)(nil)

func (s *transactionService) GetAll(ctx context.Context, transactions []*models.Transactions) ([]*models.Transactions, error) {
	return s.repo.GetAll(ctx, transactions)
}

func (s *transactionService) GetByID(ctx context.Context, transaction *models.Transactions, id uuid.UUID) (*models.Transactions, error) {
	return s.repo.GetByID(ctx, transaction, id)
}

func (s *transactionService) Create(ctx context.Context, input *dtos.CreateTransactionDto) (*models.Transactions, error) {
	transaction := &models.Transactions{
		ProjectID:     input.ProjectID,
		AmountPaid:    input.AmountPaid,
		PaymentMethod: input.PaymentMethod,
		PaymentDate:   input.PaymentDate,
	}

	return s.repo.Create(ctx, transaction)
}

func (s *transactionService) Update(ctx context.Context, input *dtos.TransactionDto, id uuid.UUID) (*models.Transactions, error) {
	transaction := &models.Transactions{
		ID:            input.ID,
		ProjectID:     input.ProjectID,
		AmountPaid:    input.AmountPaid,
		PaymentMethod: input.PaymentMethod,
		PaymentDate:   input.PaymentDate,
	}

	return s.repo.Update(ctx, transaction, id)
}

func (s *transactionService) Delete(ctx context.Context, transaction *models.Transactions, id uuid.UUID) (*models.Transactions, error) {
	return s.repo.Delete(ctx, transaction, id)
}
