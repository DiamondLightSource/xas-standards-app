import datetime
import enum
from typing import List, Optional

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class ReviewStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class LicenceType(enum.Enum):
    cc_by = "cc_by"
    cc_0 = "cc_0"
    logged_in_only = "logged_in_only"


class PersonInput(SQLModel):
    identifier: str = Field(index=True, unique=True)


class Person(PersonInput, table=True):
    id: int | None = Field(primary_key=True, default=None)
    admin: bool = False


class Element(SQLModel, table=True):
    __tablename__: str = "element"

    z: int = Field(primary_key=True, unique=True)
    symbol: str = Field(unique=True)
    name: str = Field(unique=True)


class Edge(SQLModel, table=True):
    __tablename__: str = "edge"

    name: str = Field(unique=True)
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


class XASStandardDataInput(SQLModel):
    original_filename: str
    transmission: bool
    fluorescence: bool
    reference: bool
    emission: bool
    location: str


class XASStandardData(XASStandardDataInput, table=True):
    __tablename__: str = "xas_standard_data"

    id: int | None = Field(primary_key=True, default=None)

    xas_standard: "XASStandard" = Relationship(back_populates="xas_standard_data")


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
    review_status: ReviewStatus = Field(
        sa_column=Column(Enum(ReviewStatus)), default=ReviewStatus.pending
    )

    xas_standard_data: XASStandardData = Relationship(back_populates="xas_standard")
    element: Element = Relationship(sa_relationship_kwargs={"lazy": "joined"})
    edge: Edge = Relationship(sa_relationship_kwargs={"lazy": "joined"})
    beamline: Beamline = Relationship(sa_relationship_kwargs={"lazy": "selectin"})
    submitter: Person = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[XASStandard.submitter_id]",
        }
    )


class XASStandardAdminReviewInput(SQLModel):
    reviewer_comments: Optional[str] = None
    review_status: ReviewStatus
    standard_id: int
    # get fedid from person table
