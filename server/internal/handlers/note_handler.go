package handlers

import (
	"errors"
	"founder-diary/internal/dtos"
	"founder-diary/internal/models"
	"founder-diary/internal/repositories"
	"founder-diary/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type NotesHandler struct {
	notesService services.NotesService
}

func NewNotesHandler(service services.NotesService) *NotesHandler {
	return &NotesHandler{notesService: service}
}

func (h *NotesHandler) GetAll(c *gin.Context) {
	var notes []*models.Notes

	notes, err := h.notesService.GetAll(c.Request.Context(), notes)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cound not retrive notes.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Client Fetch sucesfully.!",
		"data":    &notes,
	})
}

func (h *NotesHandler) Create(c *gin.Context) {
	input := &dtos.CreateNoteDto{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	newNote, err := h.notesService.Create(c.Request.Context(), input)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new note.!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note created sucesfully.!",
		"data":    newNote,
	})
}

func (h *NotesHandler) Update(c *gin.Context) {
	notesIDStr := c.Param("id")
	noteID, noteIDErr := uuid.Parse(notesIDStr)

	if noteIDErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format.!"})
		return
	}

	input := &dtos.NoteDto{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note, err := h.notesService.Update(c.Request.Context(), input, noteID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Note not found.!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error.!", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note updated sucesfully.!",
		"data":    note,
	})
}
