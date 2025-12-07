/**
 * Resources API client
 * All functions automatically include x-config header via apiClient
 */

import { apiClient } from './api-client';

export interface Resource {
  id: string;
  code: string;
  shift_id: string | null;
  type: string;
  stop_factor: number;
  created_at: string;
  updated_at: string;
}

export interface ResourcesResponse {
  resources: Resource[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateResourceData {
  code: string;
  shift_id?: string | null;
  type: string;
  stop_factor: number;
}

export interface UpdateResourceData {
  code?: string;
  shift_id?: string | null;
  type?: string;
  stop_factor?: number;
}

/**
 * Get all resources with pagination
 */
export async function getResources(limit = 10, offset = 0): Promise<ResourcesResponse> {
  const response = await apiClient(`/api/resources?limit=${limit}&offset=${offset}`);
  return response.json();
}

/**
 * Get resource by ID
 */
export async function getResourceById(id: string): Promise<Resource> {
  const response = await apiClient(`/api/resources/${id}`);
  return response.json();
}

/**
 * Get resource by code
 */
export async function getResourceByCode(code: string): Promise<Resource> {
  const response = await apiClient(`/api/resources/code/${code}`);
  return response.json();
}

/**
 * Get resources by type
 */
export async function getResourcesByType(type: string, limit = 10, offset = 0): Promise<ResourcesResponse> {
  const response = await apiClient(`/api/resources/type/${type}?limit=${limit}&offset=${offset}`);
  return response.json();
}

/**
 * Get resources by shift ID
 */
export async function getResourcesByShift(shiftId: string, limit = 10, offset = 0): Promise<ResourcesResponse> {
  const response = await apiClient(`/api/resources/shift/${shiftId}?limit=${limit}&offset=${offset}`);
  return response.json();
}

/**
 * Create a new resource
 */
export async function createResource(data: CreateResourceData): Promise<Resource> {
  const response = await apiClient('/api/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Update a resource
 */
export async function updateResource(id: string, data: UpdateResourceData): Promise<Resource> {
  const response = await apiClient(`/api/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Delete a resource
 */
export async function deleteResource(id: string): Promise<{ message: string }> {
  const response = await apiClient(`/api/resources/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
