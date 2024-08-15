{{/*
Expand the name of the chart.
*/}}
{{- define "xas-standards.name" -}}
{{- default .Values.global.name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "xas-standards.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Values.global.name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "xas-standards.selectorLabels" -}}
app.kubernetes.io/name: {{ include "xas-standards.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "xas-standards.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "xas-standards.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "xas-standards.backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "xas-standards.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
# {{- define "xas-standards.serviceAccountName" -}}
# {{- if .Values.serviceAccount.create }}
# {{- default (include "xas-standards.fullname" .) .Values.serviceAccount.name }}
# {{- else }}
# {{- default "default" .Values.serviceAccount.name }}
# {{- end }}
# {{- end }}
