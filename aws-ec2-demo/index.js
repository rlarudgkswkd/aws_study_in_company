const AWS = require('aws-sdk');

// AWS 자격 증명 및 한국 리전 설정
AWS.config.update({ 
  region: 'ap-northeast-2', // 한국 리전
  // accessKeyId와 secretAccessKey를 명시적으로 설정할 필요 없음
  // AWS SDK는 환경 변수를 통해 자격 증명을 자동으로 검색함
});

// EC2 서비스 객체 생성
const ec2 = new AWS.EC2();

const params = {
  ImageId: 'ami-045f2d6eeb07ce8c0', // AMI ID
  InstanceType: 't2.micro', // 인스턴스 유형
  MinCount: 1, // 최소 인스턴스 개수
  MaxCount: 1, // 최대 인스턴스 개수
  SubnetId: 'subnet-076450fa2b2592b55', // 서브넷 ID를 명시합니다
  // KeyName: 'your-key-pair-name', // (옵션) SSH 키 페어를 지정하려면 여기에 추가
};

// EC2 인스턴스 생성
ec2.runInstances(params, (err, data) => {
  if (err) {
    console.error('Could not create instance', err);
    return;
  }
  
  const instanceId = data.Instances[0].InstanceId;
  console.log('Created instance', instanceId);

  // 인스턴스 태그 설정
  const tagParams = {
    Resources: [instanceId],
    Tags: [
      {
        Key: 'Name',
        Value: 'SDK Sample'
      }
    ]
  };

  ec2.createTags(tagParams, (err) => {
    if (err) {
      console.error('Error tagging instance', err);
      return;
    }
    console.log('Instance tagged');
  });
});
