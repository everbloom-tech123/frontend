import config from '../config';

class AdminService {
  constructor() {
    this.apiUrl = `${config.API_BASE_URL}/api/v1/users/admin`;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  // Private method to get auth headers
  #getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // Private method to handle API responses
  async #handleResponse(response, errorMessage) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorMessage);
    }
    return await response.json();
  }

  /**
   * Get all users in the system
   * @returns {Promise<Array>} Array of user objects
   */
  async getAllUsers() {
    try {
      const response = await fetch(`${this.apiUrl}/all`, {
        method: 'GET',
        headers: this.#getAuthHeaders()
      });

      return await this.#handleResponse(response, 'Failed to fetch users');
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Change a user's role
   * @param {string} userId - The ID of the user
   * @param {string} newRole - The new role to assign
   * @returns {Promise<Object>} Updated user object
   */
  async changeUserRole(userId, newRole) {
    try {
      const roleToSend = newRole.replace('ROLE_', '');
      
      const response = await fetch(`${this.apiUrl}/change-role`, {
        method: 'POST',
        headers: this.#getAuthHeaders(),
        body: JSON.stringify({
          userId,
          newRole: roleToSend
        })
      });

      return await this.#handleResponse(response, 'Failed to change user role');
    } catch (error) {
      console.error('Change user role error:', error);
      throw error;
    }
  }

  /**
   * Check if a user has admin role
   * @param {Object} user - User object
   * @returns {boolean}
   */
  isAdmin(user) {
    return this.hasRole(user, 'ROLE_ADMIN');
  }

  /**
   * Check if a user has a specific role
   * @param {Object} user - User object
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(user, role) {
    const roleToCheck = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user?.roles?.includes(roleToCheck) || false;
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService;