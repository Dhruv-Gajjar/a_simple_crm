package services

import (
	"context"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"

	"github.com/google/uuid"
)

type ProjectService interface {
	GetAllProjects(ctx context.Context, projects []*models.Projects) ([]*models.Projects, error)
	GetProjectByID(ctx context.Context, project *models.Projects, id uuid.UUID) (*models.Projects, error)
	Create(ctx context.Context, projectDto *dtos.CreateProjectDTO) (*models.Projects, error)
	Update(ctx context.Context, projectDto *dtos.ProjectDTO, id uuid.UUID) (*models.Projects, error)
	Delete(ctx context.Context, project *models.Projects, id uuid.UUID) (*models.Projects, error)
}

type projectService struct {
	repo repositories.ProjectRepository
}

func NewProjectService(repo repositories.ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

var _ ProjectService = (*projectService)(nil)

func (s *projectService) GetAllProjects(ctx context.Context, projects []*models.Projects) ([]*models.Projects, error) {
	return s.repo.GetAll(ctx, projects)
}

func (s *projectService) GetProjectByID(ctx context.Context, project *models.Projects, id uuid.UUID) (*models.Projects, error) {
	return s.repo.GetByID(ctx, project, id)
}

func (s *projectService) Create(ctx context.Context, input *dtos.CreateProjectDTO) (*models.Projects, error) {
	clientIDStr := input.ClientID
	clientID, clientIDParseErr := uuid.Parse(clientIDStr.String())

	if clientIDParseErr != nil {
		return nil, clientIDParseErr
	}

	project := &models.Projects{
		Name:        input.Name,
		Description: input.Description,
		Status:      models.Status(input.Status),
		ClientID:    clientID,
		StartDate:   input.StartDate,
		EndDate:     input.EndDate,
		TotalCost:   input.TotalCost,
		Iterations:  input.Iterations,
	}
	return s.repo.Create(ctx, project)
}

func (s *projectService) Update(ctx context.Context, input *dtos.ProjectDTO, id uuid.UUID) (*models.Projects, error) {
	clientIDStr := input.ClientID
	clientID, clientIDParseErr := uuid.Parse(clientIDStr.String())

	if clientIDParseErr != nil {
		return nil, clientIDParseErr
	}

	project := &models.Projects{
		Name:        input.Name,
		Description: input.Description,
		Status:      models.Status(input.Status),
		ClientID:    clientID,
		StartDate:   input.StartDate,
		EndDate:     input.EndDate,
		TotalCost:   input.TotalCost,
		Iterations:  input.Iterations,
	}
	return s.repo.Update(ctx, project, id)
}

func (s *projectService) Delete(ctx context.Context, project *models.Projects, id uuid.UUID) (*models.Projects, error) {
	return s.repo.Delete(ctx, project, id)
}
