import React, { useState, useEffect } from 'react';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import ExperienceService from '../ExperienceService';

const ExperienceList = ({ onEdit, onView, refreshList }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, [refreshList]);

  const fetchExperiences = async () => {
    try {
      const data = await ExperienceService.getAllExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await ExperienceService.deleteExperience(id);
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading experiences...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-medium">Title</th>
            <th className="p-4 text-left font-medium">Category</th>
            <th className="p-4 text-left font-medium">Price</th>
            <th className="p-4 text-left font-medium">Tags</th>
            <th className="p-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((experience) => (
            <tr key={experience.id} className="border-t">
              <td className="p-4">{experience.title}</td>
              <td className="p-4">{experience.category?.name}</td>
              <td className="p-4">${experience.price}</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {experience.tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(experience)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(experience.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExperienceList;