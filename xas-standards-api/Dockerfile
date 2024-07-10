#build api
#copy to runtime
FROM python:3.11 as build

ARG PIP_OPTIONS=.

# set up a virtual environment and put it in PATH
RUN python -m venv /venv
ENV PATH=/venv/bin:$PATH

WORKDIR /api
COPY . .

# install python package into /venv
RUN pip install ${PIP_OPTIONS}

FROM python:3.11-slim as runtime

# Add apt-get system dependecies for runtime here if needed

# copy the virtual environment from the build stage and put it in PATH
COPY --from=build /venv/ /venv/
ENV PATH=/venv/bin:$PATH

RUN apt-get update && apt-get install libpq5 -y

EXPOSE 5000

# change this entrypoint if it is not the same as the repo
ENTRYPOINT ["xas-standards-api"]
