from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool | None = None

    @model_validator(mode="after")
    def title_cannot_be_null(self) -> "TaskUpdate":
        if "title" in self.model_fields_set and self.title is None:
            raise ValueError("title cannot be null")
        return self


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
