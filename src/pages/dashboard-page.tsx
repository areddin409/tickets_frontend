import { useRoles } from '@/hooks/use-roles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isOrganizer) {
      navigate('/dashboard/events');
      return;
    }

    if (isStaff) {
      navigate('/dashboard/validate-qr');
      return;
    }

    navigate('/dashboard/tickets');
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return <p>Loading...</p>;
};

export default DashboardPage;
