from unittest.mock import Mock, call, create_autospec

import pytest
from fastapi import HTTPException
from sqlmodel import Session

from xas_standards_api import crud
from xas_standards_api.models.models import ReviewStatus, XASStandard


def test_get_standard():
    mock_session = create_autospec(Session, instance=True)

    test_id = 0
    result = XASStandard()
    result.review_status = ReviewStatus.approved

    # Session returns None, i.e. no standard for id
    mock_session.get = Mock(return_value=None)
    expected_session_calls = [call.get(XASStandard, test_id)]

    with pytest.raises(HTTPException):
        crud.get_standard(mock_session, test_id)

    mock_session.get.assert_has_calls(expected_session_calls)

    # Session returns a standard
    mock_session.get = Mock(return_value=result)

    output = crud.get_standard(mock_session, test_id)

    assert output == result


# def test_get_standards():

#     mock_session = create_autospec(Session, instance=True)


#     crud.read_standards_page(mock_session)


# def test_get_metadata():

#     mock_session = create_autospec(Session, instance=True)

#     result = MetadataResponse(beamlines=[], edges=[], elements=[], licences=[])
#     mock_session.get = Mock(return_value=None)

#     expected_session_calls = [call.get()]

#     # mock_session.get.assert_has_calls(expected_session_calls)

#     # mock_session.get = Mock(return_value=result)

#     output = crud.get_metadata(mock_session)

#     assert output == result
