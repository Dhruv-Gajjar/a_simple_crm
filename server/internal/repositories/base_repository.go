package repositories

import (
	"context"
	"errors"
)

var (
	ErrNotFound      = errors.New("entity not found")
	ErrDuplicate     = errors.New("entity already exists")
	ErrInvalidEntity = errors.New("invalid entity")
)

type BaseReporitory[T any] interface {
	GetAll(ctx context.Context) ([]*T, error)
	Create(ctx context.Context, entity *T) (*T, error)
	GetByID(ctx context.Context, ID uint) (*T, error)
	Update(ctx context.Context, entity *T, ID uint) (*T, error)
	Delete(ctx context.Context, ID uint) (*T, error)
}
