package dtos

import (
	"time"

	"github.com/google/uuid"
)

type TransactionDto struct {
	ID            uuid.UUID
	ProjectID     uuid.UUID
	AmountPaid    float64
	PaymentMethod string
	PaymentDate   time.Time
}

type CreateTransactionDto struct {
	ProjectID     uuid.UUID
	AmountPaid    float64
	PaymentMethod string
	PaymentDate   time.Time
}
