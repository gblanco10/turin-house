from enum import Enum

class GenericErrorCodes(tuple,Enum):
    NOT_FOUND = (404,"Not found")
    DATABASE_NOT_ACKNOWLEDGED = (470,"Database not acknowledged")
    VALIDATION = (471,"Validation error")
    INTERNAL_SERVER_ERROR = (500,"Internal Server Error")