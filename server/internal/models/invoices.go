package models

import (
	"time"

	"github.com/google/uuid"
)

type InvoiceStatus string

const (
	Draft InvoiceStatus = "draft"
	Paid  InvoiceStatus = "paid"
	Sent  InvoiceStatus = "sent"
)

type Invoices struct {
	ID            uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	ProjectID     uuid.UUID `json:"project_id" gorm:"not null"`
	InvoiceNumber int       `json:"invoice_number" gorm:"uniqueIndex;not null"`
	Amount        float64   `json:"amount" gorm:"type:decimal(10,2);default:0.00;not null"`
	Status        string    `json:"status" gorm:"type:varchar(20);default:'draft';not null"`
	IssueDate     time.Time `json:"issue_date"`
	DueDate       time.Time `json:"due_date"`

	CreatedAt time.Time `json:"created_at"`
}
