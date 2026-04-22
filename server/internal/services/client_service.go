package services

import (
	"context"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"

	"github.com/google/uuid"
)

type ClientService interface {
	GetAllClients(ctx context.Context, clients []*models.Clients) (*models.ClientResponse, error)
	GetClientByID(ctx context.Context, client *models.Clients, id uuid.UUID) (*models.Clients, error)
	CreateClient(ctx context.Context, client *dtos.CreateClientDto) (*models.Clients, error)
	UpdateClient(ctx context.Context, client *dtos.ClientDto, id uuid.UUID) (*models.Clients, error)
	DeleteClient(ctx context.Context, client *models.Clients, id uuid.UUID) (*models.Clients, error)
}

type clientService struct {
	repo repositories.ClientRepository
}

func NewClientService(repo repositories.ClientRepository) ClientService {
	return &clientService{repo: repo}
}

var _ ClientService = (*clientService)(nil)

func (s *clientService) GetAllClients(ctx context.Context, clients []*models.Clients) (*models.ClientResponse, error) {
	return s.repo.GetAllClientsCount(ctx, clients)
}

func (s *clientService) GetClientByID(ctx context.Context, client *models.Clients, clientId uuid.UUID) (*models.Clients, error) {
	return s.repo.GetByID(ctx, client, clientId)
}

func (s *clientService) CreateClient(ctx context.Context, input *dtos.CreateClientDto) (*models.Clients, error) {
	client := &models.Clients{
		Name:         input.Name,
		Email:        input.Email,
		Soruce:       input.Soruce,
		ClientStatus: models.ClientStatus(input.ClientStatus),
		PhoneNumber:  input.PhoneNumber,
		Remarks:      input.Remarks,
	}
	return s.repo.Create(ctx, client)
}

func (s *clientService) UpdateClient(ctx context.Context, input *dtos.ClientDto, id uuid.UUID) (*models.Clients, error) {
	client := &models.Clients{
		Name:         input.Name,
		Email:        input.Email,
		Soruce:       input.Soruce,
		ClientStatus: models.ClientStatus(input.ClientStatus),
		PhoneNumber:  input.PhoneNumber,
		Remarks:      input.Remarks,
	}
	return s.repo.Update(ctx, client, id)
}

func (s *clientService) DeleteClient(ctx context.Context, client *models.Clients, id uuid.UUID) (*models.Clients, error) {
	return s.repo.Delete(ctx, client, id)
}
