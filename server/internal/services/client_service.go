package services

import (
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/pkg/config"
)

func GetAllClients() ([]models.Client, error) {
	var clients []models.Client

	result := config.DB.Find(&clients)

	if result.Error != nil {
		return nil, result.Error
	}

	return clients, nil
}

func GetClientById(clientId string) (models.Client, error) {
	var client = models.Client{}

	result := config.DB.Where("id = ?", clientId).First(&client)

	if result.Error != nil {
		return models.Client{}, result.Error
	}

	return client, nil
}

func CreateClient(input dtos.CreateClientDto) (models.Client, error) {
	client := models.Client{
		Name:   input.Name,
		Email:  input.Email,
		Status: models.Status(input.Status),
		Number: input.Number,
	}

	result := config.DB.Create(&client)

	if result.Error != nil {
		return models.Client{}, result.Error
	}

	return client, nil
}

func UpdateClient(clientId string, input dtos.ClientDto) (models.Client, error) {
	var client models.Client

	if err := config.DB.Where("id = ?", clientId).First(&client).Error; err != nil {
		return models.Client{}, err
	}

	updateData := models.Client{
		Name:   input.Name,
		Email:  input.Email,
		Status: models.Status(input.Status),
		Number: input.Number,
	}

	if err := config.DB.Model(&client).Updates(updateData).Error; err != nil {
		return models.Client{}, err
	}

	return client, nil
}

func DeleteClient(clientId string) error {
	var client models.Client

	if err := config.DB.Where("id = ?", clientId).First(&client).Error; err != nil {
		return err
	}

	if err := config.DB.Delete(&client).Error; err != nil {
		return err
	}

	return nil
}
