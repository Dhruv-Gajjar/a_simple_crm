package models

import "github.com/google/uuid"

type Earnings struct {
	BaseModel
	ClientID      uuid.UUID
	Client        Client `gorm:"foreignKey:ClientID"`
	TotalEarnings int    `json:"total_earnigs"`
	PaidAmount    int    `json:"paid_amount"`
	PendingAmount int    `json:"pending_amount"`
}
