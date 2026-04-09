package services

import (
	"context"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"
)

type ClientService interface {
	GetAllClients(ctx context.Context) ([]*models.Client, error)
	GetClientByID(ctx context.Context, id uint) (*models.Client, error)
	CreateClient(ctx context.Context, client *dtos.CreateClientDto) (*models.Client, error)
	UpdateClient(ctx context.Context, client *dtos.ClientDto, id uint) (*models.Client, error)
	DeleteClient(ctx context.Context, id uint) (*models.Client, error)
}

type clientService struct {
	repo repositories.ClientRepository
}

func NewClientService(repo repositories.ClientRepository) ClientService {
	return &clientService{repo: repo}
}

var _ ClientService = (*clientService)(nil)

func (s *clientService) GetAllClients(ctx context.Context) ([]*models.Client, error) {
	return s.repo.GetAll(ctx)
}

func (s *clientService) GetClientByID(ctx context.Context, clientId uint) (*models.Client, error) {
	return s.repo.GetByID(ctx, clientId)
}

func (s *clientService) CreateClient(ctx context.Context, input *dtos.CreateClientDto) (*models.Client, error) {
	client := &models.Client{
		Name:   input.Name,
		Email:  input.Email,
		About:  input.About,
		Status: models.Status(input.Status),
		Number: input.Number,
	}
	return s.repo.Create(ctx, client)
}

func (s *clientService) UpdateClient(ctx context.Context, input *dtos.ClientDto, id uint) (*models.Client, error) {
	client := &models.Client{
		Name:   input.Name,
		Email:  input.Email,
		About:  input.About,
		Status: models.Status(input.Status),
		Number: input.Number,
	}
	return s.repo.Update(ctx, client, id)
}

func (s *clientService) DeleteClient(ctx context.Context, id uint) (*models.Client, error) {
	return s.repo.Delete(ctx, id)
}
