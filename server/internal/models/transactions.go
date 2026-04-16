package models

import (
	"time"

	"github.com/google/uuid"
)

type Transactions struct {
	ID            uuid.UUID `json:"id" gorm:"primaryKey"`
	ProjectID     uuid.UUID `json:"project_id" gorm:"not null"`
	AmountPaid    float64   `json:"amount_paid" gorm:"not null"`
	PaymentMethod string    `json:"payment_method"`
	PaymentDate   time.Time `json:"payment_date" gorm:"not null"`

	CreatedAt time.Time `json:"created_at"`
}
