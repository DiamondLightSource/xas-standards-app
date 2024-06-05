import datetime
import enum
from typing import List, Optional

from pydantic import BaseModel
from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class Review(BaseModel):
    id: int
    review_status: str


class Mono(BaseModel):
    name: Optional[str] = None
    d_spacing: Optional[str] = None


class Sample(BaseModel):
    name: Optional[str] = None
    prep: Optional[str] = None


class PersonInput(SQLModel):
    identifier: str = Field(index=True, unique=True)


class Person(PersonInput, table=True):
    id: int | None = Field(primary_key=True, default=None)


class ElementInput(SQLModel):
    symbol: str = Field(unique=True)


class Element(ElementInput, table=True):
    __tablename__: str = "element"

    z: int = Field(primary_key=True, unique=True)
    name: str = Field(unique=True)


class EdgeInput(SQLModel):
    name: str = Field(unique=True)


class Edge(EdgeInput, table=True):
    __tablename__: str = "edge"

    id: int = Field(primary_key=True)
    level: str = Field(unique=True)


class Facility(SQLModel, table=True):
    __tablename__: str = "facility"

    id: int = Field(primary_key=True)
    name: str = Field(unique=True)
    notes: str
    fullname: str
    laboratory: str
    city: str
    region: str
    country: str

    beamlines: List["Beamline"] = Relationship(
        back_populates="facility", sa_relationship_kwargs={"lazy": "joined"}
    )


class Beamline(SQLModel, table=True):
    __tablename__: str = "beamline"

    id: int = Field(primary_key=True)
    name: str = Field(unique=True)
    notes: str | None
    xray_source: str | None
    facility_id: int = Field(foreign_key="facility.id")

    facility: Facility = Relationship(
        back_populates="beamlines", sa_relationship_kwargs={"lazy": "joined"}
    )


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


class MetadataResponse(SQLModel):
    beamlines: List[BeamlineResponse]
    elements: List[Element]
    edges: List[Edge]
    licences: List[str]


class XASStandardDataInput(SQLModel):
    original_filename: str
    transmission: bool
    fluorescence: bool
    emission: bool
    reference: bool
    location: str


class XASStandardData(XASStandardDataInput, table=True):
    __tablename__: str = "xas_standard_data"

    id: int | None = Field(primary_key=True, default=None)

    xas_standard: "XASStandard" = Relationship(back_populates="xas_standard_data")


class ReviewStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class LicenceType(enum.Enum):
    cc_by = "cc_by"
    cc_0 = "cc_0"
    logged_in_only = "logged_in_only"


class XASStandardInput(SQLModel):
    submitter_id: int = Field(foreign_key="person.id")
    submission_date: datetime.datetime
    collection_date: Optional[datetime.datetime]
    doi: Optional[str] = None
    citation: Optional[str] = None
    element_z: int = Field(foreign_key="element.z")
    edge_id: int = Field(foreign_key="edge.id")
    sample_name: str
    sample_prep: Optional[str]
    sample_comp: Optional[str]
    beamline_id: int = Field(foreign_key="beamline.id")
    licence: LicenceType = Field(sa_column=Column(Enum(LicenceType)))


class XASStandard(XASStandardInput, table=True):
    __tablename__: str = "xas_standard"
    id: int | None = Field(primary_key=True, default=None)
    data_id: int | None = Field(foreign_key="xas_standard_data.id", default=None)
    reviewer_id: Optional[int] = Field(foreign_key="person.id", default=None)
    reviewer_comments: Optional[str] = None
    review_status: Optional[ReviewStatus] = Field(
        sa_column=Column(Enum(ReviewStatus)), default=ReviewStatus.pending
    )

    xas_standard_data: XASStandardData = Relationship(back_populates="xas_standard")
    element: Element = Relationship(sa_relationship_kwargs={"lazy": "joined"})
    edge: Edge = Relationship(sa_relationship_kwargs={"lazy": "joined"})
    beamline: Beamline = Relationship(sa_relationship_kwargs={"lazy": "selectin"})


class XASStandardResponse(XASStandardInput):
    id: int | None
    element: ElementInput
    edge: EdgeInput
    beamline: BeamlineResponse
    submitter_id: int


class XASStandardAdminResponse(XASStandardResponse):
    reviewer_id: Optional[int] = None
    reviewer_comments: Optional[str] = None
    review_status: Optional[ReviewStatus] = None
