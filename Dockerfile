#build client
#build api
#copy to runtime

FROM node:18-bullseye-slim as build-web

WORKDIR /client

RUN yes | npm install -g pnpm

RUN apt update 

COPY xas-standards-client .

RUN yes | pnpm install

RUN pnpm vite build



FROM python:3.11 as build

ARG PIP_OPTIONS=.

# set up a virtual environment and put it in PATH
RUN python -m venv /venv
ENV PATH=/venv/bin:$PATH

WORKDIR /api
COPY xas-standards-api .

# install python package into /venv
RUN pip install ${PIP_OPTIONS}

FROM python:3.11-slim as runtime


COPY --from=build-web /client/dist /client/dist
# Add apt-get system dependecies for runtime here if needed

# copy the virtual environment from the build stage and put it in PATH
COPY --from=build /venv/ /venv/
ENV PATH=/venv/bin:$PATH

RUN apt-get update && apt-get install libpq5 -y

EXPOSE 5000

# change this entrypoint if it is not the same as the repo
ENTRYPOINT ["xas-standards-api"]
