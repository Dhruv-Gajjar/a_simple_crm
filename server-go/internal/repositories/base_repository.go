package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

var (
	ErrNotFound      = errors.New("entity not found")
	ErrDuplicate     = errors.New("entity already exists")
	ErrInvalidEntity = errors.New("invalid entity")
)

type BaseReporitory[T any] interface {
	GetAll(ctx context.Context, entity []*T) ([]*T, error)
	Create(ctx context.Context, entity *T) (*T, error)
	GetByID(ctx context.Context, entity *T, ID uuid.UUID) (*T, error)
	Update(ctx context.Context, entity *T, ID uuid.UUID) (*T, error)
	Delete(ctx context.Context, entity *T, ID uuid.UUID) (*T, error)
}

// TODO: CRUD takes argument data and pass it inside entity
