package com.imagereco.repository;

import com.imagereco.entity.DetectedObjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectedObjectRepository extends JpaRepository<DetectedObjectEntity, Long> {
    List<DetectedObjectEntity> findByAnalysisRecordId(Long analysisRecordId);
}
