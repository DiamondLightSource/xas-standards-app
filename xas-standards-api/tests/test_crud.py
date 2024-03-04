from unittest.mock import Mock, call, create_autospec

import pytest
from sqlmodel import Session

from xas_standards_api import crud
from xas_standards_api.schemas import XASStandard


def test_get_standard():

    mock_session = create_autospec(Session, instance=True)

    test_id = 0
    result = XASStandard()
    mock_session.get = Mock(return_value=None)

    expected_session_calls = [call.get(XASStandard, test_id)]

    with pytest.raises(Exception):
        crud.get_standard(mock_session, test_id)

    mock_session.get.assert_has_calls(expected_session_calls)

    mock_session.get = Mock(return_value=result)

    output = crud.get_standard(mock_session, test_id)

    assert output == result
