from typing import List

from sqlmodel import SQLModel

from .models import Edge, Element, Person, XASStandardInput


class FacilityResponse(SQLModel):
    fullname: str
    name: str
    city: str
    country: str


class BeamlineResponse(SQLModel):
    id: int
    name: str
    notes: str
    facility: FacilityResponse


class XASStandardResponse(XASStandardInput):
    id: int | None
    element: Element
    edge: Edge
    beamline: BeamlineResponse
    submitter_id: int


class AdminXASStandardResponse(XASStandardResponse):
    submitter: Person


class MetadataResponse(SQLModel):
    beamlines: List[BeamlineResponse]
    elements: List[Element]
    edges: List[Edge]
    licences: List[str]
